exports.isRequired = param => {
  throw error({
    status: '400',
    message: `${param} is required`
  })
}
