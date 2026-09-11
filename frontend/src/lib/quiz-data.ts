export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  competency: string;
};

export type CompetencyInsight = {
  competency: string;
  result: "Strong" | "Needs Practice" | "Improving";
  detail: string;
};

const mockQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "What is the primary purpose of stratified sampling in a large-scale socio-economic survey?",
    options: [
      "To divide the population into meaningful subgroups so that important groups are represented in the sample.",
      "To eliminate the need for any field-level data collection.",
      "To increase the population size before calculating survey weights.",
      "To replace statistical estimation with administrative records.",
    ],
    correctAnswer: 0,
    explanation:
      "Stratified sampling divides a population into relevant subgroups, or strata, and then selects samples from those groups. This can improve representation and sampling efficiency.",
    competency: "Survey Sampling",
  },
  {
    id: 2,
    question:
      "Which activity is most directly associated with improving statistical data quality?",
    options: [
      "Removing all unusual observations without investigation.",
      "Applying validation, consistency, and quality checks during data processing.",
      "Avoiding documentation of processing decisions.",
      "Using only the largest available dataset.",
    ],
    correctAnswer: 1,
    explanation:
      "Systematic validation and quality checks help identify errors, inconsistencies, missing values, and other issues during the statistical production process.",
    competency: "Data Quality",
  },
  {
    id: 3,
    question:
      "Which Python capability is especially useful for preparing and analysing tabular statistical data?",
    options: [
      "Managing physical survey equipment.",
      "Using data-analysis libraries such as pandas to clean and transform datasets.",
      "Issuing government digital signatures.",
      "Configuring network security devices.",
    ],
    correctAnswer: 1,
    explanation:
      "Python libraries such as pandas are widely used for cleaning, transforming, filtering, and analysing structured datasets.",
    competency: "Python",
  },
  {
    id: 4,
    question:
      "Why are metadata standards important for official statistical datasets?",
    options: [
      "They eliminate the need for data validation.",
      "They provide consistent information describing the dataset, definitions, methods, and context.",
      "They prevent all users from accessing the data.",
      "They automatically increase the sample size.",
    ],
    correctAnswer: 1,
    explanation:
      "Metadata helps users understand what the data represents, how it was produced, and how concepts and classifications should be interpreted.",
    competency: "Metadata Standards",
  },
  {
    id: 5,
    question:
      "Which practice best supports reproducible statistical data processing?",
    options: [
      "Documenting processing steps and keeping a traceable record of transformations.",
      "Changing processing steps manually without recording them.",
      "Keeping only the final output and discarding intermediate information.",
      "Avoiding standardised processing procedures.",
    ],
    correctAnswer: 0,
    explanation:
      "Documented and traceable processing steps make statistical workflows easier to reproduce, review, validate, and maintain.",
    competency: "Statistical Data Processing",
  },
  {
    id: 6,
    question:
      "Which statement best describes the role of competency-based assessment?",
    options: [
      "It only measures how many courses an employee has completed.",
      "It compares demonstrated capability with defined competency requirements.",
      "It replaces professional experience with a single test score.",
      "It focuses only on attendance records.",
    ],
    correctAnswer: 1,
    explanation:
      "Competency-based assessment looks at demonstrated knowledge and capability in relation to defined competency expectations or role requirements.",
    competency: "Competency Assessment",
  },
  {
    id: 7,
    question: "What is the main purpose of a sampling frame?",
    options: [
      "To list or identify the population units from which a sample can be selected.",
      "To calculate the final national accounts estimate.",
      "To store only completed questionnaires.",
      "To replace survey weights.",
    ],
    correctAnswer: 0,
    explanation:
      "A sampling frame provides the operational list or structure from which sample units can be selected.",
    competency: "Survey Sampling",
  },
  {
    id: 8,
    question:
      "Which measure is commonly used to describe the centre of a numerical dataset?",
    options: ["Mean", "File size", "Encryption key", "Sampling frame"],
    correctAnswer: 0,
    explanation:
      "The mean is a common measure of central tendency and is calculated by dividing the sum of observations by the number of observations.",
    competency: "Statistical Analysis",
  },
  {
    id: 9,
    question: "What is the primary purpose of data validation rules?",
    options: [
      "To identify values or records that violate expected conditions or constraints.",
      "To remove the need for subject-matter review.",
      "To guarantee that every observation is correct.",
      "To increase the number of records automatically.",
    ],
    correctAnswer: 0,
    explanation:
      "Validation rules identify entries that do not satisfy expected ranges, relationships, formats, or consistency conditions.",
    competency: "Data Quality",
  },
  {
    id: 10,
    question:
      "Which Python data structure is commonly used to store an ordered collection of values?",
    options: ["List", "Firewall", "Digital signature", "Metadata standard"],
    correctAnswer: 0,
    explanation:
      "A Python list is an ordered and mutable collection that can store multiple values.",
    competency: "Python",
  },
  {
    id: 11,
    question:
      "What does SQL primarily allow an analyst to do with a relational database?",
    options: [
      "Query and manipulate structured data.",
      "Design a survey questionnaire without data.",
      "Create a sampling frame automatically for every survey.",
      "Replace all statistical methods with machine learning.",
    ],
    correctAnswer: 0,
    explanation:
      "SQL is used to retrieve, filter, aggregate, insert, update, and otherwise manipulate data stored in relational databases.",
    competency: "SQL",
  },
  {
    id: 12,
    question:
      "Why is documentation important in an official statistical production process?",
    options: [
      "It improves transparency, reproducibility, and understanding of methods.",
      "It eliminates the need for quality assurance.",
      "It guarantees that no future revision will ever be needed.",
      "It replaces the underlying statistical methodology.",
    ],
    correctAnswer: 0,
    explanation:
      "Good documentation helps users and reviewers understand methods, decisions, transformations, and sources used during statistical production.",
    competency: "Statistical Processes",
  },
  {
    id: 13,
    question: "What is a key benefit of visualizing statistical data?",
    options: [
      "It can make patterns, trends, comparisons, and unusual observations easier to identify.",
      "It eliminates the need to inspect the underlying data.",
      "It guarantees that an interpretation is correct.",
      "It replaces all numerical analysis.",
    ],
    correctAnswer: 0,
    explanation:
      "Well-designed visualizations help analysts and stakeholders recognize patterns, trends, distributions, and comparisons more quickly.",
    competency: "Data Visualization",
  },
  {
    id: 14,
    question:
      "Which concept refers to information that describes another dataset?",
    options: ["Metadata", "Sample weight", "Query result", "Encryption token"],
    correctAnswer: 0,
    explanation:
      "Metadata is structured information that describes data, including concepts, definitions, sources, methods, and other contextual information.",
    competency: "Metadata Standards",
  },
  {
    id: 15,
    question:
      "What is the purpose of applying survey weights during statistical estimation?",
    options: [
      "To account for aspects of the sample design and improve population-level estimates.",
      "To convert every observation into the same value.",
      "To remove all sampling variability.",
      "To replace data validation.",
    ],
    correctAnswer: 0,
    explanation:
      "Survey weights can account for selection probabilities and other design features so that estimates better represent the target population.",
    competency: "Survey Sampling",
  },
  {
    id: 16,
    question:
      "Which approach is most appropriate when a dataset contains missing values?",
    options: [
      "Investigate the cause and apply an appropriate documented treatment.",
      "Always replace every missing value with zero.",
      "Delete the entire dataset.",
      "Ignore missingness in every analysis.",
    ],
    correctAnswer: 0,
    explanation:
      "Missing data should be investigated and handled using an appropriate, documented method based on the context and analytical requirements.",
    competency: "Data Quality",
  },
  {
    id: 17,
    question: "What is the main purpose of a data dictionary?",
    options: [
      "To describe variables, definitions, formats, and other characteristics of a dataset.",
      "To perform statistical modelling automatically.",
      "To replace the database itself.",
      "To eliminate the need for metadata.",
    ],
    correctAnswer: 0,
    explanation:
      "A data dictionary provides structured information about dataset fields, including names, meanings, formats, and allowed values.",
    competency: "Data Management",
  },
  {
    id: 18,
    question: "Which of the following is an example of a categorical variable?",
    options: ["Department", "Annual income", "Age in years", "Household expenditure"],
    correctAnswer: 0,
    explanation:
      "Department represents categories or groups, whereas income, age, and expenditure are numerical variables.",
    competency: "Statistical Analysis",
  },
  {
    id: 19,
    question:
      "Why should statistical processing workflows be version controlled?",
    options: [
      "To track changes and improve reproducibility of analytical work.",
      "To automatically correct every statistical error.",
      "To prevent analysts from updating methods.",
      "To eliminate the need for documentation.",
    ],
    correctAnswer: 0,
    explanation:
      "Version control records changes to code and related files, making analytical workflows easier to review, reproduce, and maintain.",
    competency: "Technical & Analytical",
  },
  {
    id: 20,
    question:
      "Which principle is most important when presenting official statistical findings?",
    options: [
      "Present results clearly, accurately, and with appropriate context.",
      "Only present results that support a preferred conclusion.",
      "Remove methodological information from every publication.",
      "Use visual effects instead of statistical evidence.",
    ],
    correctAnswer: 0,
    explanation:
      "Official statistical findings should be communicated accurately and transparently, with enough context for users to interpret them appropriately.",
    competency: "Statistical Communication",
  },
];

const mockInsights: CompetencyInsight[] = [
  {
    competency: "Survey Sampling",
    result: "Strong",
    detail: "Strong understanding demonstrated in the assessment.",
  },
  {
    competency: "Data Quality",
    result: "Needs Practice",
    detail: "Additional targeted practice is recommended.",
  },
  {
    competency: "Python",
    result: "Improving",
    detail: "Performance indicates progress in the technical skill area.",
  },
];

export function getQuizQuestions(): QuizQuestion[] {
  return mockQuestions;
}

export function getQuizInsights(): CompetencyInsight[] {
  return mockInsights;
}
