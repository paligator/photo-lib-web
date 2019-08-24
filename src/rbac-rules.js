const rules = {
	"photo:setFavourite": ["editor"]
	// guest: {

	// },
	// editor: {
	// 	static: [
	// 		"photo:setFavourite",
	// 	],
	// 	dynamic: {
	// 		"posts:edit": ({ userId, postOwnerId }) => {
	// 			if (!userId || !postOwnerId) return false;
	// 			return userId === postOwnerId;
	// 		}
	// 	}
	// },
	// admin: {
	// 	static: [
	// 		"photo:setFavourite",
	// 	]
	// },
	// superAdmin: {
	// 	static: [
	// 		"photo:setFavourite",
	// 	]
	// }
};

export default rules;