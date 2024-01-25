package controllers

import dto.LoginBody
import dto.RegisterUserBody
import dto.UserDTO
import dto.UserWithReviewsDTO
import io.javalin.http.BadRequestResponse
import io.javalin.http.Context
import io.javalin.http.NotFoundResponse
import io.javalin.http.UnauthorizedResponse
import io.javalin.validation.ValidationException
import org.unq.SteamSystem
import org.unq.model.DraftUser
import org.unq.model.NotFoundUser
import org.unq.model.User
import org.unq.model.UserException

class UserController(private val system: SteamSystem, private val tokenController: TokenController) {

    fun login(ctx: Context) {
        val userLogin: LoginBody
        try {
            userLogin = ctx.bodyValidator<LoginBody>(LoginBody::class.java)
                .check({ it.email.isNotBlank() }, "Username cannot be empty")
                .check({ it.password.isNotBlank() }, "Password cannot be empty")
                .get()
        } catch (e: ValidationException) {
            val m = e.errors["REQUEST_BODY"]!![0].message
            throw BadRequestResponse(m)
        }
        val user = system.users.find { it.email == userLogin.email && it.password == userLogin.password } ?: throw BadRequestResponse("Wrong email or password")
        ctx.header(tokenController.header, tokenController.userToToken(user))
        ctx.json(UserDTO(user))
    }

    fun register(ctx: Context) {
        val registerUser: RegisterUserBody
        try {
            registerUser = ctx.bodyValidator<RegisterUserBody>(RegisterUserBody::class.java)
                .check({ it.email.isNotBlank() }, "Email cannot be empty")
                .check( { it.email.contains("@")}, "Invalid email")
                .check({ it.password.isNotBlank() }, "Password cannot be empty")
                .check({ it.name.isNotBlank() }, "Name cannot be empty")
                .check({ it.image.isNotBlank() }, "Image cannot be empty")
                .check( { it.image.contains(".")}, "Invalid user image")
                .check({ it.backgroundImage.isNotBlank() }, "BackgroundImage cannot be empty")
                .check( { it.backgroundImage.contains(".")}, "Invalid background image")
                .get()
        } catch (e: ValidationException) {
            ctx.status(400)
            val m = e.errors["REQUEST_BODY"]!![0].message
            if (m == "DESERIALIZATION_FAILED") {
                throw BadRequestResponse("Not valid body")
            }
            throw BadRequestResponse(m)
        } catch (e: Exception) {
            throw BadRequestResponse("Not valid body")
        }

        val draftUser = DraftUser(
            registerUser.name,
            registerUser.email,
            registerUser.password,
            registerUser.image,
            registerUser.backgroundImage
        )

        try {
            system.addNewUser(draftUser)
        } catch (e: Exception) {
            throw BadRequestResponse("Email is taken")
        }

        val user = system.users.find { it.email == draftUser.email } ?: throw NotFoundResponse("User not Registered")

        ctx.header(tokenController.header, tokenController.userToToken(user))
        ctx.json(UserDTO(user))
    }

    fun getCurrentUser(ctx: Context) {
        val tk = ctx.header(tokenController.header) ?: throw UnauthorizedResponse("Unauthorized")
        try {
            val user = tokenController.tokenToUser(tk)
            ctx.json(UserDTO(user))
        } catch (e: Exception) {
            throw UnauthorizedResponse("Unauthorized")
        }
    }

    fun getUserByID(ctx: Context) {
        try {
            val userID = ctx.pathParam("id")
            val reviews = system.getUserReviews(userID)
            val user = system.getUser(userID)
            ctx.json(UserWithReviewsDTO(user, reviews))
        } catch (e: NotFoundUser) {
            throw NotFoundResponse("User not found")
        }
    }

    fun addOrRemoveFriend(ctx: Context) {
        val userID = ctx.pathParam("id")
        val tk = ctx.header(tokenController.header) ?: throw UnauthorizedResponse("Unauthorized")

        val user = tokenController.tokenToUser(tk)

        try {
            system.getUser(userID)
            system.addOrRemoveFriend(user.id, userID)
            ctx.json(UserDTO(user))
        } catch (e: UserException) {
            throw BadRequestResponse("Error self-add")
        } catch (e: NotFoundUser) {
            throw NotFoundResponse("User not found")
        } catch (e: Exception) {
            throw BadRequestResponse("Something went wrong")
        }

    }
}