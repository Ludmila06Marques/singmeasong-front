 
import {recommendationService} from "../../src/services/recommendationsService"
import {recommendationRepository} from "../../src/repositories/recommendationRepository"
import app  from "../../src/app"
import supertest from "supertest";
import { isRef } from "joi";
import { recommendationController } from "../../src/controllers/recommendationController";
import { recommendationSchema } from "../../src/schemas/recommendationsSchemas";
import {faker} from '@faker-js/faker'



  const server= supertest(app)

describe('Testes de POST de recomondations',()=>{

 it('Deve criar uma recomendation',async()=>{
    const newRecomendation= {
        
        name: `Henrique music`,
        youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
    
}
    jest.spyOn(recommendationRepository ,'findByName').mockImplementationOnce(():any=>{})

    jest.spyOn(recommendationRepository ,'create').mockImplementationOnce(():any=>{})
    await recommendationService.insert(newRecomendation)

    expect(recommendationRepository.findByName).toBeCalled()

    expect(recommendationRepository.create).toBeCalled()
 })
 it('Nao deve criar uma recomendation por conflito',async ()=>{
    const newRecomendation= {
        
        name: `Henrique music`,
        youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
    
}
  jest.spyOn(recommendationRepository ,'findByName').mockImplementationOnce(():any=>{
    return{
          
        name: `Henrique music`,
        youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"
    }
  })

  const promise=    recommendationService.insert(newRecomendation)
  expect(promise).rejects.toEqual({ type: "conflict", message:"Recommendations names must be unique" })

 })
 it('Nao deve criar uma recomendation por schema',async ()=>{
    const newRecomendation= {
        
        name: `Henrique music`,
        youtubeLink: "https://bootcampra.notion.site/Projeto-21-Sing-me-a-Song-8e4af88ba9f24ab49378b512b2472df4"
    
}

jest.spyOn(recommendationSchema , 'validate').mockImplementationOnce(():any=>{return { type: "wrong_schema", message:' ' }})


const promise= recommendationService.insert(newRecomendation)
  expect(promise).rejects.toEqual({ type: "wrong_schema", message:' ' })

 })
 it("Pegar recomendation pelo id com sucesso",async ()=>{
    const recomendation={
        
        id: 1,
        name: "Chitãozinho E Xororó - Evidências",
        youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
        score: 245
    
}

jest.spyOn(recommendationRepository ,'find').mockImplementationOnce(():any=>{
    return recomendation
})

await recommendationService.getById(recomendation.id)

expect(recommendationRepository.find).toBeCalled()



 })
 it("Pegar recomendation pelo id com falha",async ()=>{
    const recomendation={
        
        id: 1,
        name: "Chitãozinho E Xororó - Evidências",
        youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
        score: 245
    
}

jest.spyOn(recommendationRepository ,'find').mockImplementationOnce(():any=>{
 
})
const promise=  recommendationService.getById(recomendation.id)
expect(promise).rejects.toEqual( { type: 'not_found', message: '' })

 })

 it('Deve curtir uma recomendation',async ()=>{
    const recomendation={
        
            id: 1,
            name: "Chitãozinho E Xororó - Evidências",
            youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
            score: 245
        
    }
   
    jest.spyOn(recommendationRepository ,'find').mockImplementationOnce(():any=>{
        return recomendation
    })
    jest.spyOn(recommendationRepository ,'updateScore').mockImplementationOnce(():any=>{
        return {
            id: 1,
            name: "Chitãozinho E Xororó - Evidências",
            youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
            score: 246
        }
    })

      await recommendationService.upvote(recomendation.id)

    expect(recommendationRepository.find).toBeCalled()
    expect(recommendationRepository.updateScore).toBeCalled()
 })
 it('Deve descurtir uma recomendation',async ()=>{
    const recomendation={
        
            id: 1,
            name: "Chitãozinho E Xororó - Evidências",
            youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
            score: 245
        
    }
   
    jest.spyOn(recommendationRepository ,'find').mockImplementationOnce(():any=>{
        return recomendation
    })
    jest.spyOn(recommendationRepository ,'updateScore').mockImplementationOnce(():any=>{
        return {
            id: 1,
            name: "Chitãozinho E Xororó - Evidências",
            youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
            score: 244
        }
    })

      await recommendationService.downvote(recomendation.id)

    expect(recommendationRepository.find).toBeCalled()
    expect(recommendationRepository.updateScore).toBeCalled()
 })
 it('Deve remover a recomendation',async ()=>{
    const recomendation={
        
        id: 1,
        name: "Chitãozinho E Xororó - Evidências",
        youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
        score: -9
    
}

jest.spyOn(recommendationRepository ,'find').mockImplementationOnce(():any=>{
    return recomendation
})
jest.spyOn(recommendationRepository ,'updateScore').mockImplementationOnce(():any=>{
    return {
        id: 1,
        name: "Chitãozinho E Xororó - Evidências",
        youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
        score: -10
    }
})
jest.spyOn(recommendationRepository , 'remove').mockImplementationOnce(():any=>{

})

  await recommendationService.downvote(recomendation.id)

expect(recommendationRepository.find).toBeCalled()
expect(recommendationRepository.updateScore).toBeCalled()
expect(recommendationRepository.remove).toBeCalled()
 })
 it('Deve pegar as recomendations' , async()=>{
  jest.spyOn(recommendationRepository , 'findAll').mockImplementationOnce(():any=>{})

  await recommendationService.get()


expect(recommendationRepository.findAll).toBeCalled()


 })
 it('Deve pegar o top recomendation' , async ()=>{
    jest.spyOn(recommendationRepository,'getAmountByScore').mockImplementationOnce(():any=>{

    })
    await recommendationService.getTop(5)
    expect(recommendationRepository.getAmountByScore).toBeCalled()

 })
 it('Random:caso nao encontrar nenhuma recomendation com o filtro aplicado', async ()=>{
   
    jest.spyOn(recommendationRepository , 'findAll').mockImplementationOnce(():any=>{return []})

    const promise = recommendationService.getRandom()
    expect(promise).rejects.toEqual( { type: 'not_found', message: '' })
 })
 it('Deve recomendar com getScoreFilter maior que 0.7', async ()=>{
   
    jest.spyOn(recommendationRepository , 'findAll').mockImplementationOnce(():any=>{return [{id: 8042, name: "Henrique e Juliano7", score: 15, youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"},{id: 8043, name: "Henrique e Juliano7", score: 16, youtubeLink: "https://www.youtube.com/watch?v=tJjNwskOeBk"}]})

   const promise= recommendationService.getRandom()

   expect(recommendationRepository.findAll).toBeCalled()
   expect(recommendationService.getRandom).toBeCalled
 })
   
})