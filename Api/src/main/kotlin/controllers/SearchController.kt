package controllers

import dto.PageInfoSimpleGameDTO
import dto.PageInfoSimpleUserDTO
import io.javalin.http.BadRequestResponse
import io.javalin.http.Context
import org.unq.SteamSystem

class SearchController (private val system: SteamSystem, private val tokenController: TokenController) {

    fun searchUsers(ctx: Context) {
        val name = ctx.queryParam("q")  ?: throw BadRequestResponse("Missing name parameter")
        val pageN = ctx.queryParam("page") ?: throw BadRequestResponse("Missing page parameter")

        try {
            val pageSimpleUserDTO = PageInfoSimpleUserDTO(system.searchUser(name, pageN.toInt()))
            ctx.json(pageSimpleUserDTO)
        }catch (e: Exception) {
            throw BadRequestResponse("Error query param page must be greater or equals than 1")
        }
    }

    fun searchGames(ctx: Context) {
        val name = ctx.queryParam("q")  ?: throw BadRequestResponse("Missing name parameter")
        val pageN = ctx.queryParam("page") ?: throw BadRequestResponse("Missing page parameter")
        try {
            val pageSimpleGameDTO = PageInfoSimpleGameDTO(system.searchGame(name, pageN.toInt()))
            ctx.json(pageSimpleGameDTO)
        }catch (e: Exception) {
            throw BadRequestResponse("Error query param page must be greater or equals than 1")
        }
    }
}