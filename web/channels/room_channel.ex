defmodule Draw.RoomChannel do
	use Phoenix.Channel
	require Logger

	def join("rooms:" <> _rid, _message, socket) do
		send(self, :after_join)
		{:ok, socket}
	end

	def handle_info(:after_join, %{assigns: %{user: user}} = socket) do
		broadcast! socket, "user:join", %{user: user}
		{:noreply, socket}
	end

	def handle_in(event, message, %{assigns: %{user: user}} = socket) do
		broadcast! socket, event, Map.put(message, :user, user)
		{:noreply, socket}
	end

	intercept ["user:move"]
	def handle_out(event, message, %{assigns: %{user: out_user}} = socket) do
		if out_user == message.user do
			{:noreply, socket}
		else
			push socket, event, message
			{:noreply, socket}
		end
	end

	def terminate(_reason, %{assigns: %{user: user}} = socket) do
		broadcast! socket, "user:leave", %{user: user}
		{:noreply, socket}
	end
end
