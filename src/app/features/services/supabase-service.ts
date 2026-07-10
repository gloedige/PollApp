import { Injectable, signal } from '@angular/core';
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey } from '../interfaces/survey';
import { Question } from '../interfaces/question';
import { Vote} from '../interfaces/vote';
import { Option } from '../interfaces/option';
import { SurveyFormValue } from '../interfaces/survey-form';
import { OptionCreateDto, SurveyCreateDto } from '../interfaces/survey-dto';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  questions = signal<Question[]>([]);
  options = signal<Option[]>([]);
  votes = signal<Vote[]>([]);
  private readonly alternativeExpiryDate = '2049-12-31';

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    this.getAllVotes();
  }

  channels:  RealtimeChannel | undefined;
  surveys = signal<Survey[]>([]);

  /**
   * This function retrieves a survey by its ID from the Supabase database. It queries the 'surveys' table for a survey with 
   * the specified ID and returns it. If there is an error during the fetch, it logs the error and returns null.
   * @param surveyId - The ID of the survey to fetch.
   * @returns - A promise that resolves to the survey object if found, or null if an error occurs.
   */
  async getSurveyById(surveyId: number): Promise<Survey | null> {
    const { data: singleSurvey, error: ResponseError } = await this.supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();
    if (ResponseError) {
      console.error(`Error fetching survey with ID ${surveyId}:`, ResponseError);
      return null;
    }
    return singleSurvey as Survey;
  }

  /**
   * This function retrieves all surveys from the Supabase database and updates the surveys signal with the fetched data.
   * It also subscribes to real-time changes for the surveys table.
   * @returns - A promise that resolves when the surveys are fetched and the subscription is set up.
   */
  async getAllSurveys() {
    let { data: surveys } = await this.supabase
    .from('surveys')
    .select('*');
    if (!surveys) return;
    this.surveys.set(surveys);
  }

  /**
   * This function retrieves questions for a specific survey from the Supabase database based on the provided survey ID. It 
   * returns an array of questions associated with that survey.
   * @param surveyId - The ID of the survey for which to fetch questions.
   * @returns - A promise that resolves to an array of questions for the specified survey.
   */
  async getAllQuestionsBySurveyId(surveyId: number) {
    let { data: questions, error } = await this.supabase
    .from('questions')
    .select('*')
    .eq('survey_id', surveyId);
    if (questions) {
      this.questions.set(questions);
    } else {
      console.error(`Error fetching questions for survey ID ${surveyId}:`, error);
    }
  }

  /**
   * This function retrieves all options from the Supabase database and updates the options signal with the fetched data. 
   * It logs the fetched options or any errors that occur during the fetch process.
   */
  async getAllOptions() {
    let { data: options, error } = await this.supabase
    .from('options')
    .select('*')
    if (options) {
      this.options.set(options);
    } else {
      console.error(`Error fetching options:`, error);
    }
  }

  /**
   * This function retrieves all votes from the Supabase database and updates the votes signal with the fetched data.
   * It logs the fetched votes or any errors that occur during the fetch process.
   * @returns - A promise that resolves when the votes are fetched and the votes signal is updated.
   */
  async getAllVotes() {
    let { data: votes, error } = await this.supabase
    .from('votes')
    .select('*');
    if (votes) {
      this.votes.set(votes);
    } else {
      console.error(`Error fetching votes:`, error);
    }
  }

  /**
   * This function adds new votes to the Supabase database. It takes an array of votes as input and inserts them into the 'votes' table.
   * If the insertion is successful, it logs the added votes and refreshes the votes by calling getAllVotes(). If there's an error, it 
   * logs the error.
   * @param votes - An array of votes to be added to the database.
   */
  async addNewVotes(votes: Vote[]) {
    const { data, error } = await this.supabase
      .from('votes')
      .insert(votes);
    if (error) {
      console.error('Error adding new votes:', error);
    } else {
      console.log('New votes added:', data);
      this.getAllVotes(); // Refresh the votes after adding new ones
    }
  }

  /**
   * This function sets up real-time subscriptions to the surveys table in the Supabase database. It listens for INSERT, UPDATE, and 
   * DELETE events and updates the surveys signal accordingly when changes occur.
   * @returns - void
   */
  subscribeToSurveyChanges() {
    if (this.channels) return; 
    this.channels = this.supabase
      .channel('surveys')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'surveys' },
        (payload) => {
          this.surveys.update(list => [...list, payload.new as Survey]);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'surveys' },
        (payload) => {
          this.surveys.update(list =>
            list.map(s => s.id === (payload.new as Survey).id ? payload.new as Survey : s)
          );
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'surveys' },
        (payload) => {
          this.surveys.update(list =>
            list.filter(s => s.id !== (payload.old as Survey).id)
          );
        }
      )
      .subscribe();
  }

  /**
   * This function is called when the component is destroyed. It checks if there are any active channels for real-time subscriptions and 
   * removes them to clean up resources.
   */
  ngOnDestroy() {
    if (this.channels) {
      this.supabase.removeChannel(this.channels);
    }
  }

  /**
   * This function stores all new survey details in the Supabase database. It takes a SurveyFormValue object as input, maps it to a SurveyCreateDto,
   * and then adds the survey, questions, and options to the database. It handles errors during the process and logs relevant information.
   * @param surveyForm - The SurveyFormValue object containing the survey details and questions to be stored in the database.
   * @returns - A promise that resolves when all survey details are stored in the database.
   */
  async storeAllNewSurveyDetails(surveyForm: SurveyFormValue) {
    const surveyDto = this.mapSurveyFormToCreateDto(surveyForm);

    const { id: surveyId, error: surveyError } = await this.addNewSurvey({ title: surveyDto.title, description: surveyDto.description, expiry_date: surveyDto.expiry_date, category: surveyDto.category });
    if (surveyError) return;

    for (const question of surveyDto.questions) {      
      const questionId = await this.addNewQuestion({ question: question.question, multiple_options: question.multiple_options, survey_id: surveyId });
      const options = this.mapSurveyFormOptions(question, questionId);

      await this.addNewOptions(options);
    }
  }

  /**
   * This function maps the survey form data to a SurveyCreateDto object. It takes the survey form value as input and constructs a DTO that can 
   * be used for creating a new survey in the database.
   * @param surveyForm - The survey form value containing the survey details and questions.
   * @returns - A SurveyCreateDto object containing the mapped survey data.
   */
  private mapSurveyFormToCreateDto(surveyForm: SurveyFormValue): SurveyCreateDto {
    return {
      title: surveyForm.survey_title,
      description: surveyForm.description,
      expiry_date: surveyForm.expiry_date ? surveyForm.expiry_date : this.alternativeExpiryDate,
      category: surveyForm.category,
      questions: surveyForm.questions.map((question) => ({
        question: question.title,
        multiple_options: question.multiple,
        options: question.options.map((option) => ({
          option_text: option.text
        })),
      })),
    };
  }

  /**
   * This furnction maps the options from the survey form to an array of OptionCreateDto objects. It takes a question object and its corresponding
   * question ID as input and constructs an array of DTOs that can be used for creating new options in the database.
   * @param question - The question object containing the options to be mapped.
   * @param questionId - The ID of the question to which the options belong.
   * @returns - An array of OptionCreateDto objects containing the mapped option data.
   */
  private mapSurveyFormOptions(question: { options: { option_text: string }[] }, questionId: number) {
    return question.options.map(option => ({
      question_id: questionId,
      option_text: option.option_text
    }));
  }

  /**
   * This function adds a new survey to the Supabase database. It takes a survey object containing the title, description, expiry date, and category,
   * and inserts it into the 'surveys' table. If the insertion is successful, it logs the new survey's ID; otherwise, it logs an error.
   * @param survey - An object containing the survey details (title, description, expiry date, and category) to be added to the database.
   * @returns - A promise that resolves to an object containing the new survey's ID and any error that occurred during the insertion.
   */
  async addNewSurvey(survey: { title: string; description?: string; expiry_date?: string; category: string }) {
    const { data: insertedSurvey, error: surveyError } = await this.supabase
      .from('surveys')
      .insert(survey)
      .select('id')
      .single();
    if (surveyError || !insertedSurvey) {
      console.error('Error storing new survey:', surveyError);
    } else {
      console.log('New survey stored:', insertedSurvey);
    }
    return { id: insertedSurvey?.id, error: surveyError };
  }

  /**
   * This function adds a new question to the Supabase database. It takes a question object containing the question text, multiple options flag,
   * and survey ID, and inserts it into the 'questions' table. If the insertion is successful, it logs the new question's ID; otherwise, it logs an error.
   * @param questionObj - An object containing the question details (question text, multiple options flag, and survey ID) to be added to the database.
   * @returns - A promise that resolves to the new question's ID if the insertion is successful, or undefined if there was an error.
   */
  async addNewQuestion(questionObj: { question: string; multiple_options: boolean; survey_id: number }) {
    const { data: insertedQuestion, error } = await this.supabase
      .from('questions')
      .insert(questionObj)
      .select('id')
      .single();
    if (error) {
      console.error('Error adding new question:', error);
    } else {
      console.log('New question added:', insertedQuestion);
    }

    return insertedQuestion?.id;
  }

  /**
   * This function adds new options to the Supabase database. It takes an array of OptionCreateDto objects and inserts them into the 'options' table.
   * If the insertion is successful, it logs the added options; otherwise, it logs an error.
   * @param options - An array of OptionCreateDto objects containing the options to be added to the database.
   */
  async addNewOptions(options: OptionCreateDto[]) {
    const { error: optionError } = await this.supabase
      .from('options')
      .insert(options);
    if (optionError) {
      console.error('Error adding new options:', optionError);
    }
  }


}