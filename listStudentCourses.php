<?
	/**
	 * Created by PhpStorm.
	 * User: Deathnerd
	 * Date: 4/7/14
	 * Time: 8:02 PM
	 */
	error_reporting(E_ALL);
	require_once("autoloader.php");
	session_start();

	$enrolledCourses = $Courses->fetchEnrolledCourses($_SESSION['userName'], 'student');

	//if the user is not enrolled in any courses
	if (is_array($enrolledCourses)) {
		header('Access-Control-Allow-Origin: ');
		header('Content-type: application/json');
		exit(json_encode($enrolledCourses));
	}

	$Utils->exitWithMessage("UH OH!");