import React from 'react'
import SignUp from '../component/Signup/SignUp'

const SignUpPage = ({ setPage }) => {
	return (
		<div>
			<SignUp onSwitchToLogin={setPage} />
		</div>
	)
}

export default SignUpPage
