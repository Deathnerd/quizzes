<?
	//signup.php
	//user account creation page
?>
<!doctype html>
<html>
	<head>
		<title>Sign Up</title>
		<meta name="description" content="Sign Up page">
		<meta name="author" content="Wes Gilleland">
		<meta name="published" content="TODO">
		<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
		<script type="text/javascript" src="scripts/main.js"></script>
		<link type="text/css" rel="stylesheet" href="styles/reset.css">
		<link type="text/css" rel="stylesheet" href="styles/main.css">
	</head>
	<body>
		<header id="topNav">
			<div id="logo">
			</div>
			<div id="dropdown">
			</div>
			<p id="pageTitle"></p>
		</header>
		<div id="bodyContainer">
			<p>User Name:</p>
			<input type="text" id="userName"><br/>
			<p>Password:</p>
			<input type="password"><br/>
			<input type="button" value="login" id="signUpButton"><br/>
			<p id="message" style="display: none">Stuff</p>
		</div>
	</body>
</html>