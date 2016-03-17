(function($){
	
	$.App = function(options){
		var socket = io.connect('http://localhost:3000');
		roomEvent();

		function roomEvent(){
			$('#roomSendBtn').click(function(){
				var msg = $('#room_message_content').val();
				$('#room_message_content').val('');
				socket.emit('room-message-send', msg );
			});
		}
	}
	
		
	
})(jQuery);

$(document).ready(function(e){
	$.App();
});