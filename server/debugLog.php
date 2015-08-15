<?php

class debugLog {
	private static function debug_mode() {
		return true; // debug mode
	}

	public static function debug_log($message) {
		if(debugLog::debug_mode() == true) {
			echo "<br><b>" . date("d-m-y h:i:s") . ": </b>" . $message;
		}
	}

	public static function log($message) {
		debugLog::debug_log($message);
	}

	public static function important_log($message) {
		$color = 'red';
		if($message == "START" || $message == "DONE")
			$color = 'orange';
		if(debugLog::debug_mode() == true) {
			echo "<br><b>". "<hr style='border-color:". $color ."'>";
			echo date("d-m-y h:i:s") . ": </b>" . $message;
			echo "<hr style='border-color:". $color ."'>";
		}
	}
}
?>