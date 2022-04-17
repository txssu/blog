import { Sequelize } from 'sequelize'

export default function errorHandler (err, req, res, next) {
  if (err instanceof Sequelize.ValidationError) {
    const msg = err.errors.map(x => x.message).join('\n')
    res.status(422).send({ msg })
  } else {
    console.error(err, err.stack)
    res.status(500).send({ msg: 'Something unexpected happened' })
  }
}
