import { validationResult, body } from 'express-validator'

export default function () {
  const validators = [...arguments].map(field =>
    body(field)
      .not()
      .isEmpty()
  )
  validators.push(function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const resBody = errors.array().map(error => `Field ${error.param} is required`) // TODO: change error format
      res.status(422).json({ msg: resBody })
    } else {
      next()
    }
  })
  return validators
}
