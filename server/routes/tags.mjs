import express from 'express'
import asyncHandler from 'express-async-handler'

import adminOnly from '../middleware/admin.mjs'

import * as crud from '../app/crud.mjs'
import renderTag from '../renders/tag.mjs'
const router = express.Router()

/**
 *  @openapi
 *  components:
 *    schemas:
 *      Tag:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          title:
 *            type: string
 *      UpdatedTag:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *          parentTagId:
 *            type: integer
 *      TagHierarchy:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          title:
 *            type: string
 *          ChildrenTags:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Tag'
 *          ParentTag:
 *            $ref: '#/components/schemas/TagHierarchy'
 *        example:
 *          id: 42
 *          title: Programming language
 *          ChildrenTags:
 *            - id: 43
 *              title: JavaScript
 *            - id: 44
 *              title: Elixir
 *          ParentTag:
 *            id: 41
 *            title: Development
 *    parameters:
 *      tagId:
 *        name: tagId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */

/**
 *  @openapi
 *  /tags:
 *    get:
 *      description: Get list of all tags
 *      responses:
 *        200:
 *          description: Returns list of tags
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/TagHierarchy'
 *        500:
 *          $ref: '#/components/responses/ServerError'
 */
router.get(
  '/',
  asyncHandler(async function (req, res) {
    const tags = await crud.getAllTags()
    res.send(tags.map(x => renderTag(x, true)))
  })
)

/**
 *  @openapi
 *  /tags/{tagId}:
 *    get:
 *      description: Get tag and its children by id
 *      parameters:
 *        - $ref: '#/components/parameters/tagId'
 *      responses:
 *        200:
 *          description: Returns list of tags
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/TagWithChildren'
 *        404:
 *          description: There is no tag with this ID
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        500:
 *          $ref: '#/components/responses/ServerError'
 */
router.get(
  '/:tagId',
  asyncHandler(async function (req, res) {
    const { tagId } = req.params
    const tag = await crud.getTagById(tagId)
    if (tag === null) {
      res.status(404).send({ msg: 'Tag not found' })
    } else {
      res.send(renderTag(tag))
    }
  })
)

/**
 *  @openapi
 *  /tags/{tagId}:
 *    put:
 *      description: Update tag title or parent tag. Admin only.
 *      parameters:
 *        - $ref: '#/components/parameters/tagId'
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdatedTag'
 *      responses:
 *        200:
 *          description: Success
 *        500:
 *          $ref: '#/components/responses/ServerError'
 */
router.put(
  '/:tagId',
  adminOnly,
  asyncHandler(async function (req, res) {
    const { tagId } = req.params
    await crud.updateTag(tagId, req.body)
    res.send()
  })
)

export default router
