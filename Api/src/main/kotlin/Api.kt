import controllers.*
import io.javalin.Javalin

import io.javalin.apibuilder.ApiBuilder.*
import io.javalin.security.RouteRole
import org.unq.data.initSteamSystem

internal enum class Roles : RouteRole {
    ANYONE, USER
}

class Api {

    val steamSystem = initSteamSystem()

    private val tokenController = TokenController(steamSystem)
    private val userController = UserController(steamSystem, tokenController)
    private val gamesController = GamesController(steamSystem, tokenController)
    private val tagController = TagController(steamSystem, tokenController)
    private val searchController = SearchController(steamSystem, tokenController)


    fun start() {
        val app = Javalin.create { config ->
            config.http.defaultContentType = "application/json"
            config.accessManager(tokenController::validate)
            config.plugins.enableCors { cors -> cors.add {
                it.anyHost()
                it.exposeHeader("Authorization")
            } }
        }.start(7070)
        app.routes {
            path("/login") {
                post(userController::login, Roles.ANYONE)
            }
            path("/register") {
                post(userController::register, Roles.ANYONE)
            }
            path("/users") {
                path("/current") {
                    get(userController::getCurrentUser, Roles.USER)
                }
                path("{id}") {
                    get(userController::getUserByID, Roles.ANYONE)
                    path("/friends") {
                        put(userController::addOrRemoveFriend, Roles.USER)
                    }
                }
            }
            path("/games") {
                get(gamesController::getGames, Roles.ANYONE)
                path("/recommended") {
                    get(gamesController::getRecommendedGames, Roles.ANYONE)
                }
                path("/{id}") {
                    get(gamesController::getGameByID, Roles.ANYONE)
                    path("/reviews") {
                        put(gamesController::addGameReview, Roles.USER)
                    }
                    path("/purchase") {
                        post(gamesController::purchaseGame, Roles.USER)
                    }
                }
            }
            path("/tags") {
                get(tagController::getAllTags, Roles.ANYONE)
            }
            path("/search/") {
                path("/users") {
                    get(searchController::searchUsers, Roles.ANYONE)
                }
                path("/games") {
                    get(searchController::searchGames, Roles.ANYONE)
                }
            }
        }
    }
}

fun main() {
    Api().start()
}
