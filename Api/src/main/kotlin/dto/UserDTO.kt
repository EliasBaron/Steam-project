package dto

import org.unq.model.*

class ExceptionDTO(val title: String, val status: Number)

class LoginBody(val email: String, val password: String)

class UserDTO(user: User) {
    val id = user.id
    val email = user.email
    val name = user.name
    val image = user.image
    val backgroundImage = user.backgroundImage
    val games = user.games.map { game -> SimpleGameDTO(game) }
    val friends = user.friends.map { user -> SimpleUserDTO(user) }
}

class UserWithReviewsDTO(user: User, reviews: List <Review>) {
    val id = user.id
    val email = user.email
    val name = user.name
    val image = user.image
    val backgroundImage = user.backgroundImage
    val games = user.games.map { game -> SimpleGameDTO(game) }
    val friends = user.friends.map { user -> SimpleUserDTO(user) }
    val reviews = reviews.map { review -> ReviewDTO(review) }
}

class SimpleUserDTO(user: User) {
    val id = user.id
    val name = user.name
    val image = user.image
}


class ImageDTO(image: Image) {
    val src = image.src
}

class PageInfoSimpleUserDTO(pageInfo: PageInfo<User>) {
    val currentPage = pageInfo.currentPage
    val amountOfElements = pageInfo.amountOfElements
    val amountOfPages = pageInfo.amountOfPages
    val list = pageInfo.list.map { user -> SimpleUserDTO(user) }
}

class RegisterUserBody(val email: String, val password: String, val name: String, val image: String, val backgroundImage: String)
