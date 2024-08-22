import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import NewState from "@/app/components/NewState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
interface IParams {
    conversationId: string;
};

const ConversationId = async ({ params }: { params: IParams }) => {

    console.log("Starting:");
    console.log("Conversation ID: " + params.conversationId)
    console.log("Ending:");
    const conversation = await getConversationById(params.conversationId)
    const messages = await getMessages(params.conversationId)

    if (!messages) { return }

    if (!conversation) {
        return (

            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <NewState />
                </div>
            </div>
        )
    }
    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <Form />
            </div>
        </div>
    )
}
export default ConversationId