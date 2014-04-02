<?
	/**
	 * This page will allow the user to sign in. If they are not already, the user will be redirected to the index
	 */
	session_start();
	if (isset($_SESSION['userName'])) { //if there's already a user logged in, redirect them to the index
		header('Location: index.php');
	}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<meta name="description" content="Practice Exams for CSC 185">
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
	<input type="button" value="login" id="loginButton"><br/>
	<a href="signup.php">Not registered? Sign up</a>

	<p id="message" style="display: none">Stuff</p>
</div>
</body>
</html>