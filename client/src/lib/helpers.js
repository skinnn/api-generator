/**
 * Decodes Base64URL endcoded JWT-s.
 * @param 		{String} 	token  	[JWT]
 * @returns									 		[Decoded token]
 */
export const decodeJWT = (token) => {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(atob(base64)
		.split('')
		// eslint-disable-next-line
		.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
		.join(''));

	return JSON.parse(jsonPayload);
};