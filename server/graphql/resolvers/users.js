const { AuthenticationError, UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/User')
const checkAuth = require('../../util/checkAuth')
const { validateSigninInput } = require('../../util/validators')
const { SECRET_KEY, WHITELISTED_DOMAINS } = require('../../config')

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      givenName: user.givenName,
      familyName: user.familyName,
      displayName: user.displayName,
      email: user.email,
      role: user.role
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  )
}

function isValidatedDomain(domain) {
  const validate = WHITELISTED_DOMAINS.filter(dom => domain.match(dom))

  if (validate.length > 0) return true
  else return false
}

module.exports = {
  Query: {
    getUsers: async (_, { count }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')

      try {
        const users = await User.find().limit(count).sort({ createdAt: -1 })
        return users
      } catch (err) {
        throw new Error(err)
      }
    },

    getUser: async (_, { email }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')

      try {
        const user = await User.findOne({ email })

        if (!user) throw new Error('User not found')

        return user
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    googleSignin: async (_, { token }) => {
      if (!token) throw new Error('No token presented')

      const googleUser = jwt.decode(token)

      if (!googleUser.hd || !isValidatedDomain(googleUser.hd))
        throw new AuthenticationError('Unauthorized email')

      const user = await User.findOne({ email: googleUser.email })

      let res
      if (!user) {
        const newUser = new User({
          givenName: googleUser.given_name,
          familyName: googleUser.family_name,
          displayName: googleUser.name,
          email: googleUser.email,
          role: 'Member'
        })
        res = await newUser.save()
      } else {
        user.givenName = googleUser.given_name
        user.familyName = googleUser.family_name
        user.displayName = googleUser.name
        res = await user.save()
      }

      const newToken = generateToken(res)
      return {
        ...res._doc,
        id: res._id,
        token: newToken
      }
    },
    signin: async (_, { email, password }) => {
      const { errors, valid } = validateSigninInput(email, password)

      if (!valid) throw new UserInputError('Errors', { errors })

      const user = await User.findOne({ email })

      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', {
          errors
        })
      }

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token
      }
    }
  }
}
