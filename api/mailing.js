import mailchimp from './mailchimp'

function addToList(email) {
  if (process.env.MAILCHIMP_API_KEY) {
    return mailchimp.post(`/lists/${process.env.MAILCHIMP_DEFAULT_LIST}/members`, {
      email_address: email,
      status: 'subscribed'
    })
  } else {
    return Promise.resolve()
  }
}

export default { addToList }
