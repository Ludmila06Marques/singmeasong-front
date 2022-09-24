import { prisma } from "../src/database";
import supertest from "supertest";
import app from "../src/app";
import * as theatre from "../tests/factories/theatreFactory"





beforeEach(async() => {
    await theatre.execute(); 
  });

  const server= supertest(app)

describe('Testes de POST de recomondations',()=>{

    it('POST /: Adiciona uma nova recomendação de música' , async ()=>{
        const recomendation=  {
        
            name: "Henrique e Juliano",
            youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
        
    }
        
        const result = await server.post('/recommendations').send(recomendation)
        const recomendationExist=  await prisma.recommendation.findFirst({
            where:{name:recomendation.name}
        })
       
      

        expect(result.status).toBe(201)//criado
        expect(recomendationExist).not.toBeNull()

    } )
    it('POST /recommendations/:id/upvote: Adiciona um ponto à pontuação da recomendação', async ()=>{
        const recomendation=  {
        
            name: "Henrique e Juliano",
            youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
        
    }
        
         await server.post('/recommendations').send(recomendation)
         const result = await prisma.recommendation.findFirst({
            where:{name:recomendation.name}
        })

        
      
       
  

          const response = await server.post(`/recommendations/${result.id}/upvote`)

          const resultUpdate= await prisma.recommendation.findFirst({where:{id:result.id}})
         

         expect(response.status).toBe(200)
         expect(result).not.toBeNull()
         expect(resultUpdate.score).toBe(1)

    })
    it('POST /recommendations/:id/downvote: Remove um ponto da pontuação da recomendação' , async ()=>{
        const recomendation=  {
        
            name: "Henrique e Juliano",
            youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
        
    }
        
         await server.post('/recommendations').send(recomendation)
         
         const result = await prisma.recommendation.findFirst({
            where:{name:recomendation.name}
        })

           await server.post(`/recommendations/${result.id}/upvote`)


          const resultIncrement= await prisma.recommendation.findFirst({where:{id:result.id}})

         const response =  await server.post(`/recommendations/${result.id}/downvote`)

           const resultDecrement= await prisma.recommendation.findFirst({where:{id:result.id}})
         

        expect(response.status).toBe(200)
         expect(result).not.toBeNull()
         expect(result.score).toBe(0)
         expect(resultIncrement.score).toBe(1)
         expect(resultDecrement.score).toBe(0)
    })
})


describe('Testes de GET de recomondations',()=>{

    it('GET /recomendations: Pega todas as últimas 10 recomendações' , async ()=>{
        for(let i=0 ; i<15 ; i++){
            const recomendation=  {
        
                name: `Henrique e Juliano${i}`,
                youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
            
        }
        await server.post('/recommendations').send(recomendation)

        }

        
        const response = await server.get(`/recomendations`)
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(10)
       

    } )
    it('GET /recommendations/:id : Pega uma recomendação pelo seu ID', async ()=>{
        const recomendation=  {
        
            name: `Henrique e Juliano`,
            youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
        
    }
    await server.post('/recommendations').send(recomendation)

    const result = await prisma.recommendation.findFirst({
        where:{name:recomendation.name}
    })

   const response=  await server.get(`/recommendations/${result.id}`).send(recomendation)
  
    expect(response.status).toBe(200)
    expect(result.id).toBe(response.body.id)
    })
    it('GET /recommendations/top/:amount: Lista as músicas com maior número de pontos e sua pontuação', async ()=>{
        for(let i=0 ; i<15 ; i++){
            const recomendation=  {
        
                name: `Henrique e Juliano${i}`,
                youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
            
        }
        await server.post('/recommendations').send(recomendation)
        
        }
        const recomendations=await  server.get('/recomendations')
        for(let j=0 ; j<15 ; j++){
            await server.post(`/recommendations/${recomendations.body[0].id}/upvote`) 
         }
         for(let i=0 ; i<14; i++){
            await server.post(`/recommendations/${recomendations.body[2].id}/upvote`) 
         }
         for(let h=0 ; h<6 ; h++){
            await server.post(`/recommendations/${recomendations.body[5].id}/upvote`) 
         }
         for(let m=0 ; m<recomendations.body.length ; m++){
            await server.post(`/recommendations/${recomendations.body[m].id}/upvote`) 
         }
       

         const result = await server.get('/recommendations/top/5')

         expect(result.status).toBe(200)
         expect(result.body.length).toBe(5)
         expect(result.body[3].score).toBeLessThan(result.body[1].score)
    })
    it('GET /recommendations/random:  Caso nao haja nenhuma musica cadastrada' ,async ()=>{
        const result = await server.get('/recommendations/random')
        console.log(result.body)

        expect(result.status).toBe(404)
      
    })
      /*
    it.todo('GET /recommendations/random: pegar só os maiores que 10', async ()=>{

    })
    it.todo('GET /recommendations/random: pegar só os menores que 10')
    
   
    it.todo('GET /recommendations/random: Pega uma recomendação aleatória:70% das vezes que baterem nessa rota:uma música com pontuação maior que 10 deve ser recomendada aleatoriamente', async ()=>{         
        for(let i=0 ; i<15 ; i++){
            const recomendation=  {
        
                name: `Henrique e Juliano${i}`,
                youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
            
        }
        await server.post('/recommendations').send(recomendation)
        
        }
        const recomendations=await  server.get('/recomendations')
      
     //   jest.spyOn(Math, "random").mockReturnValue(0.7)
        for(let j=0 ; j<15 ; j++){
            await server.post(`/recommendations/${recomendations.body[0].id}/upvote`) 
         }
         for(let i=0 ; i<14; i++){
            await server.post(`/recommendations/${recomendations.body[2].id}/upvote`) 
         }
         for(let h=0 ; h<6 ; h++){
            await server.post(`/recommendations/${recomendations.body[5].id}/upvote`) 
         }
         for(let m=0 ; m<recomendations.body.length ; m++){
            await server.post(`/recommendations/${recomendations.body[m].id}/upvote`) 
         }
    
         const result = await server.get('/recommendations/random')
         console.log(result.body)
       
       
    })
   
    it.todo('GET /recommendations/random: Pega uma recomendação aleatória:30% das vezes que baterem nessa rota: uma música com pontuação entre -5 e 10 (inclusive), deve ser recomendada aleatoriamente', async ()=>{
          
        for(let i=0 ; i<15 ; i++){
            const recomendation=  {
        
                name: `Henrique e Juliano${i}`,
                youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
            
        }
        await server.post('/recommendations').send(recomendation)
        
        }
        const recomendations=await  server.get('/recomendations')
      
    
        for(let j=0 ; j<15 ; j++){
            await server.post(`/recommendations/${recomendations.body[0].id}/upvote`) 
         }
         for(let i=0 ; i<14; i++){
            await server.post(`/recommendations/${recomendations.body[2].id}/upvote`) 
         }
         for(let h=0 ; h<6 ; h++){
            await server.post(`/recommendations/${recomendations.body[5].id}/upvote`) 
         }
         for(let m=0 ; m<recomendations.body.length ; m++){
            await server.post(`/recommendations/${recomendations.body[m].id}/upvote`) 
         }
    
         const recomendationsIncrement=await  server.get('/recomendations')
         console.log(recomendationsIncrement.body)
       
       
    
        

    })
    it.todo('GET /recommendations/random: Pega uma recomendação aleatória:100% das vezes deve ser sorteada qualquer música Caso só haja músicas com pontuação acima de 10', async ()=>{
          
        for(let i=0 ; i<15 ; i++){
            const recomendation=  {
        
                name: `Henrique e Juliano${i}`,
                youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
            
        }
        await server.post('/recommendations').send(recomendation)
        
        }
        const recomendations=await  server.get('/recomendations')
      
         for(let m=0 ; m<recomendations.body.length ; m++){
            for(let j=0 ; j<11 ; j++){
                await server.post(`/recommendations/${recomendations.body[m].id}/upvote`) 
            }
           
         }
    
         const recomendationsIncrement=await  server.get('/recomendations')
         console.log(recomendationsIncrement.body)
       
       
    
        

    })
    it.todo('GET /recommendations/random: Pega uma recomendação aleatória:100% das vezes deve ser sorteada qualquer música Caso só haja músicas com pontuação abaixo/igual a 10', async ()=>{
          
        for(let i=0 ; i<15 ; i++){
            const recomendation=  {
        
                name: `Henrique e Juliano${i}`,
                youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
            
        }
        await server.post('/recommendations').send(recomendation)
        
        }
        const recomendations=await  server.get('/recomendations')
      
         for(let m=0 ; m<recomendations.body.length ; m++){
            for(let j=0 ; j<8 ; j++){
                await server.post(`/recommendations/${recomendations.body[m].id}/upvote`) 
            }
           
         }
    
         const recomendationsIncrement=await  server.get('/recomendations')
         console.log(recomendationsIncrement.body)
       
       
   
        

    })

    it.todo('GET /recommendations/random: Caso nao haja nenhuma musica cadastrada' , async()=>{
        const result = await server.get('/recomendations')

        expect(result.body).toBe({})
        expect(result.status).toBe(404)
    })
    
    */
})

afterAll(async () => {
    await prisma.$disconnect();
  });