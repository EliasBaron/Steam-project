package controllers

import dto.*
import io.javalin.http.BadRequestResponse
import io.javalin.http.Context
import io.javalin.http.HttpResponseException
import io.javalin.http.NotFoundResponse
import org.unq.SteamSystem
import org.unq.model.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class GamesController(private val system: SteamSystem, private val tokenController: TokenController) {

    fun getGames(ctx: Context) {
        val pageN = ctx.queryParam("page")?.toInt() ?: throw BadRequestResponse("Missing page parameter")
        try {
            val pageInfoSimpleGameDTO = PageInfoSimpleGameDTO(system.getGames(pageN))
            ctx.json(pageInfoSimpleGameDTO)
        } catch (e: Exception) {
            throw BadRequestResponse("Error query param page must be greater or equals than 1")
        }
    }

    fun getRecommendedGames(ctx: Context) {
        val recommendedGames = system.getRecommendedGames().map { game -> SimpleGameDTO(game) }

        ctx.json(recommendedGames)
    }

    fun getGameByID(ctx: Context) {
        val gameID = ctx.pathParam("id")
        try {
            ctx.json(GameDTO(system.getGame(gameID)))
        } catch (e: NotFoundGame) {
            throw NotFoundResponse("Error game id not found")
        }
    }

    fun addGameReview(ctx: Context) {
        val gameId = ctx.pathParam("id")
        val user = tokenController.tokenToUser(ctx.header(tokenController.header)!!)
        val reviewBody = ctx.bodyValidator<AddReviewBody>(AddReviewBody::class.java)
            .check({ it.text.isNotBlank() }, "Text cannot be empty")
            .getOrThrow { throw BadRequestResponse("Error on body") }
        val draftReview = DraftReview(gameId, reviewBody.isRecommended, reviewBody.text)

        try {
            ctx.json(GameDTO(system.addReview(user.id, draftReview)))
        } catch (e: NotFoundGame) {
            throw NotFoundResponse("Game id not found")
        } catch (e: ReviewException) {
            throw BadRequestResponse("You cannot review a game without the game or you already have a review")
        }
    }

    fun purchaseGame(ctx: Context) {
        val gameId = ctx.pathParam("id")
        val user = tokenController.tokenToUser(ctx.header(tokenController.header)!!)
        val purchaseBody = ctx.bodyValidator<PurchaseBody>(PurchaseBody::class.java)
            .check({ it.cardHolderName.isNotBlank() }, "cardHolderName cannot be empty")
            .check({ it.cvv > 0 }, "cvv cannot be minor than 1")
            .check({ it.expirationDate.isNotBlank() }, "expiration date cannot be empty")
            .check({ it.number > 0 }, "the card number cannot be minor than 1")
            .getOrThrow { throw BadRequestResponse("Error on body") }
        val expirationDate = parseExpirationDate(purchaseBody.expirationDate)

        val cardInfo = CardInfo(
            purchaseBody.cardHolderName,
            purchaseBody.number,
            expirationDate,
            purchaseBody.cvv
        )
        val draftPurchase = DraftPurchase(gameId, cardInfo)

        try {
            ctx.json(UserDTO(system.purchaseGame(user.id, draftPurchase)))
        } catch (e: PurchaseException) {
            throw BadRequestResponse("User already have the game")
        } catch (e: NotFoundGame) {
            throw NotFoundResponse("Error game id not found")
        }

    }

    fun parseExpirationDate(dateString: String): LocalDate {
        try {
            val format = DateTimeFormatter.ofPattern("MM-dd-yyyy")
            return LocalDate.parse(dateString, format)
        } catch (e: Exception) {
            throw BadRequestResponse("date format must be MM-dd-yyyy")
        }
    }

}