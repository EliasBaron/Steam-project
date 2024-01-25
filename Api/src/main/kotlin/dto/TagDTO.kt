package dto

import org.unq.model.Tag

class TagDTO(tag: Tag) {
    val id = tag.id
    val name = tag.name
    val image = ImageDTO(tag.image)
}
