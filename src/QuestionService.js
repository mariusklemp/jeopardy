// Fetch questions function
/**
 * @param {RequestInfo | URL} filePath
 */
export async function fetchQuestions(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();

    const rows = text
        .split('\n')
        .map(line => line.split(';')); // Use semicolon as the delimiter

    const headers = rows[0].map(header => header.trim()); // Trim each header
    const data = rows.slice(1);

    const questions = data.map(row => {
        const question = {};
        headers.forEach((header, index) => {
            // @ts-ignore
            question[header] = row[index].trim(); // Trim each value
        });
        return question;
    });

    return questions;
}
