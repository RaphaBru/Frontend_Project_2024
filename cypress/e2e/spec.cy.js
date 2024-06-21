describe('Travel Journal Entry Test', () => {
  it('should complete the travel journal entry process, update an entry, delete an entry, and verify deletion', () => {
    cy.visit('https://frontend-project-2024.vercel.app/');

    // Select the email input field and type an email into it
    cy.get('input[type="email"]')
      .type('raphael.brunold@stud.fhgr.ch')
      .should('have.value', 'raphael.brunold@stud.fhgr.ch');

    // Select the password input field and type a password into it
    cy.get('input[type="password"]')
      .type('testtest')
      .should('have.value', 'testtest');

    // Select the login button and click it
    cy.get('button[type="submit"]').click();

    // Wait for navigation to complete (adjust as necessary)
    cy.url().should('include', '/user-');

    // Fill in the travel form fields
    cy.get('input#country')
      .type('Kenya')
      .should('have.value', 'Kenya');

    cy.get('input#year')
      .clear() // Clear the existing value first
      .type('2012')
      .should('have.value', '2012');

    cy.get('select#highlight')
      .select('Nature')
      .should('have.value', 'Nature');

    cy.get('select#score')
      .select('9')
      .should('have.value', '9');

    // Click the submit button
    cy.get('button:contains("Submit")').click();

    // Click the edit entries button
    cy.get('button:contains("Edit Entries")').click();

    // Wait for navigation to complete (adjust as necessary)
    cy.url().should('include', '/user-');

    // Select the score 10 for the first entry
    cy.get('select[id^="score-"]').first().select('10').should('have.value', '10');

    // Click the update button for the first entry
    cy.get('button:contains("Update")').first().click();

    // Click the first 'Return to my Journal' button
    cy.get('button:contains("Return to my Journal")').first().click();

    // Wait for navigation to complete (adjust as necessary)
    cy.url().should('include', '/user-');

    // Click the edit entries button again
    cy.get('button:contains("Edit Entries")').first().click();

    // Wait for navigation to complete (adjust as necessary)
    cy.url().should('include', '/user-');

    // Click the first delete button
    cy.get('button:contains("Delete")').first().click();

    // Click the first 'Return to my Journal' button again
    cy.get('button:contains("Return to my Journal")').first().click();

    // Wait for navigation to complete (adjust as necessary)
    cy.url().should('include', '/user-');

    // Check if the word "Kenya" is not present on the page
    cy.contains('Kenya').should('not.exist');
  });
});
