
describe('Testa a pagina home', () => {
  
 //beforeEach(() => {
 //  cy.request("POST", "http://localhost:5000/recommendations/reset", {});  })
  it('Testa criar um recomendacao ', () => {
    const video={
      name:"oioioiiiii",
      link:"https://www.youtube.com/watch?v=H2SAELpeucI"
    }


    cy.visit('http://localhost:3000/')
    cy.intercept("GET", "http://localhost:5000/recommendations").as("getRecomendations");
    cy.get("input[placeholder='Name']").type(video.name);
		cy.get("input[placeholder='https://youtu.be/...']").type(video.link);
    cy.intercept("POST", "http://localhost:5000/recommendations").as("createRecommendation");
		cy.get("button").click();
    cy.wait("@createRecommendation");
    cy.wait("@getRecomendations");


 cy.contains(video.name)

   
  })
  it('Testa clicar na aba top',()=>{
    cy.get('#Top').click()
       cy.visit('http://localhost:3000/top')
    cy.url().should('eq' ,'http://localhost:3000/top' )
   

  })
  it('Testa clicar na aba Random',()=>{
    cy.get('#Random').click()
    / cy.visit('http://localhost:3000/random')
    cy.url().should('eq' ,'http://localhost:3000/random' )
   

  })
  it('Testa clicar na aba home',()=>{
    cy.get('#Home').click()
     cy.visit('http://localhost:3000/')
    cy.url().should('eq' ,'http://localhost:3000/' )

  })
  it('Testa dar play no video',()=>{
    cy.get('#play').click()
  })
  it('Testa dar like', ()=>{

    cy.get('#up').click()
  })
  it('Testa dar dislike', ()=>{
    cy.get('#down').click()
  })

})
