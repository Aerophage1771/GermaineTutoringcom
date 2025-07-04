import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { db } from '../server/db';
import { lsatQuestions } from '../shared/schema';

interface CSVRow {
  PrepTest_Number: string;
  Section_Number: string;
  Section_Type: string;
  Question_Number_in_Section: string;
  Question_ID: string;
  Question_Difficulty: string;
  Question_50_Percent_Score: string;
  LR_Question_Type: string;
  LR_Skills: string;
  RC_Passage_ID: string;
  RC_Passage_Number_in_Section: string;
  RC_Passage_Difficulty: string;
  RC_Passage_Categories: string;
  RC_Question_Categories: string;
  RC_Question_Number_in_Passage: string;
}

async function importLSATData() {
  console.log('Starting LSAT data import...');
  
  const records: any[] = [];
  
  return new Promise((resolve, reject) => {
    createReadStream('attached_assets/lsat_data_export_metadata_truncated_1751670808554.csv')
      .pipe(parse({ 
        delimiter: ',',
        columns: true,
        skip_empty_lines: true,
        trim: true
      }))
      .on('data', (row: CSVRow) => {
        const record = {
          prep_test_number: parseInt(row.PrepTest_Number) || 0,
          section_number: parseInt(row.Section_Number) || 0,
          section_type: row.Section_Type || '',
          question_number_in_section: row.Question_Number_in_Section ? parseInt(row.Question_Number_in_Section) : null,
          question_id: row.Question_ID || '',
          question_difficulty: row.Question_Difficulty ? parseInt(row.Question_Difficulty) : null,
          question_50_percent_score: row.Question_50_Percent_Score || null,
          lr_question_type: row.LR_Question_Type || null,
          lr_skills: row.LR_Skills || null,
          rc_passage_id: row.RC_Passage_ID || null,
          rc_passage_number_in_section: row.RC_Passage_Number_in_Section ? parseInt(row.RC_Passage_Number_in_Section) : null,
          rc_passage_difficulty: row.RC_Passage_Difficulty ? parseInt(row.RC_Passage_Difficulty) : null,
          rc_passage_categories: row.RC_Passage_Categories || null,
          rc_question_categories: row.RC_Question_Categories || null,
          rc_question_number_in_passage: row.RC_Question_Number_in_Passage ? parseInt(row.RC_Question_Number_in_Passage) : null,
        };
        records.push(record);
      })
      .on('end', async () => {
        try {
          console.log(`Parsed ${records.length} records, inserting into database...`);
          
          // Insert in batches of 100 to avoid memory issues
          const batchSize = 100;
          for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            await db.insert(lsatQuestions).values(batch);
            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}`);
          }
          
          console.log('LSAT data import completed successfully!');
          resolve(true);
        } catch (error) {
          console.error('Error inserting data:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      });
  });
}

// Run the import
importLSATData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });