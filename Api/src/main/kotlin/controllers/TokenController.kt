package controllers

import Roles
import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.algorithms.Algorithm
import io.javalin.security.RouteRole
import io.javalin.http.Context
import io.javalin.http.ForbiddenResponse
import io.javalin.http.Handler
import io.javalin.http.UnauthorizedResponse
import javalinjwt.JWTGenerator
import javalinjwt.JWTProvider
import org.unq.SteamSystem
import org.unq.model.User

class UserGenerator : JWTGenerator<User> {
    override fun generate(user: User, alg: Algorithm?): String {
        val token: JWTCreator.Builder = JWT.create()
            .withClaim("id", user.id)
        return token.sign(alg)
    }
}

class TokenController(private val system: SteamSystem) {


    private val algorithm = Algorithm.HMAC256("very_secret")
    private val verifier = JWT.require(algorithm).build()
    private val generator = UserGenerator()
    private val provider = JWTProvider(algorithm, generator, verifier)
    val header = "Authorization"

    fun userToToken(user: User): String {
        return provider.generateToken(user)
    }

    fun tokenToUser(token: String): User {
        val validateToken = provider.validateToken(token)
        val userId = validateToken.get().getClaim("id").asString()
        return system.getUser(userId)
    }

    fun validate(handler: Handler, ctx: Context, permittedRoles: Set<RouteRole>) {
        val header = ctx.header(header)
        when {
            permittedRoles.contains(Roles.ANYONE) -> handler.handle(ctx)
            header == null -> {
                throw UnauthorizedResponse("Unauthorized")
            }
            else -> {
                val token = provider.validateToken(header)
                if (token.isPresent) {
                    val userId = token.get().getClaim("id").asString()
                    val user = system.getUser(userId)
                    //eliminamos user.isAdmin
                    if (permittedRoles.contains(Roles.USER)) {
                        ctx.attribute("user", user)
                        handler.handle(ctx)
                    } else {
                        throw ForbiddenResponse("You are not authorized")
                    }

                } else {
                    throw UnauthorizedResponse("Unauthorized")
                }
            }
        }
    }
}
