type User = {
	user_id: string;
	login: string;
	password: string;
	user_type: "USER" | "SUDO";
}

export default User