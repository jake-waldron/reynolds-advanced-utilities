describe("App", () => {
  it("should navigate to the about page", () => {
    // Start from the index page
    cy.visit("/");

    // Find a link with an href attribute containing "about" and click it
    cy.findByRole("link", { name: /about/i }).click();

    // The new url should include "/about"
    cy.url().should("include", "/about");

    // The new page should contain an h1 with "About page"
    cy.findByRole("heading", { name: /about page/i }).should("exist");
  });
});

export {};
