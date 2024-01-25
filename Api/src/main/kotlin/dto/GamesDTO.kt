package dto

import org.unq.model.*

class GameDTO(game : Game) {
    val id = game.id
    val name = game.name
    val description = game.description
    val mainImage = ImageDTO(game.mainImage)
    val multimedia = game.multimedia.map { image -> ImageDTO(image)  }
    val tags = game.tags.map { tag -> TagDTO(tag) }
    val price = PriceDTO(game.price)
    val requirement = RequirementDTO(game.requirement)
    val relatedGames = game.relatedGames.map { game -> SimpleGameDTO(game) }
    val developer = DeveloperDTO(game.developer)
    val releaseDate = game.releaseDate.toString()
    val reviews = game.reviews.map { review -> ReviewDTO(review) }
    val esrb = game.esrb
    val website = game.website
}

class RequirementDTO(requirement: Requirement) {
    val os = requirement.os
    val processor = requirement.processor
    val memory = requirement.memory
    val graphics = requirement.graphics
    val directX = requirement.directX
    val storage = requirement.storage
}

class DeveloperDTO(developer: Developer) {
    val id = developer.id
    val name = developer.name
    val image = ImageDTO(developer.image)
}

class ReviewDTO(review: Review) {
    val id = review.id
    val user = SimpleUserDTO(review.user)
    val game = SimpleGameDTO(review.game)
    val isRecommended = review.isRecommended
    val text = review.text
}

class SimpleGameDTO(game: Game) {
    val id = game.id
    val name = game.name
    val mainImage = ImageDTO(game.mainImage)
    val tags = game.tags.map { tag -> TagDTO(tag) }
    val price = PriceDTO(game.price)
}


class PriceDTO(price: Price) {
    val amount = price.amount
    val currency = price.currency
}

class PageInfoSimpleGameDTO(pageInfo: PageInfo<Game>) {
    val currentPage = pageInfo.currentPage
    val amountOfElements = pageInfo.amountOfElements
    val amountOfPages = pageInfo.amountOfPages
    val list = pageInfo.list.map { game -> SimpleGameDTO(game) }
}

class AddReviewBody(val isRecommended: Boolean, val text: String)

class PurchaseBody(val cardHolderName: String, val cvv: Int, val expirationDate: String, val number: Int)