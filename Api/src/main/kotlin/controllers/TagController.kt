package controllers

import dto.TagDTO
import io.javalin.http.Context
import org.unq.SteamSystem

class TagController (private val system: SteamSystem, private val tokenController: TokenController) {

    fun getAllTags(ctx: Context) {
        val tags = system.tags.map { tag -> TagDTO(tag) }
        ctx.json(tags)
    }

}