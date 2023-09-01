const resolve = (client, user) => {
	const find = client.users.fetch(user)
	return find;
}
export default resolve;