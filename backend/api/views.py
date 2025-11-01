from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from agent_manager import get_or_create_agent, end_session

@api_view(['GET'])
def hello(request):
    return Response({"message": "Hello from Django!"})


# @api_view(['GET'])
# def start(request):
#     """Create a new session and return a session_id."""
#     session_id = create_new_session()
#     return Response({"status": "success", "session_id": session_id}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def chat(request):
    """Start or continue an existing chat session."""
    message = request.data.get("message")

    if not message:
        return Response({
            "status": "error",
            "response": "Invalid message."
        }, status=status.HTTP_400_BAD_REQUEST)

    agent = get_or_create_agent(request.session)
    result = agent.invoke({
        "messages": [{
            "role": "user", 
            "content": message
        }]},
        config={ "configurable": {"thread_id": request.session.session_key } }
    )

    last_message = result.get('messages', [])[-1] if result.get('messages') else None

    if not (last_message and hasattr(last_message, 'content') and last_message.content):
        return Response({
            "status": "error",
            "response": "Server Error"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        "status": "success",
        "response": last_message.content
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def end(request):
    """End and delete the chat session."""
    if end_session(request.session):
        request.session.flush()
        return Response({"status": "success", "message": "Session ended successfully"})
    
    return Response({
        "status": "error",
        "response": "No active session."
    }, status=status.HTTP_404_NOT_FOUND)

