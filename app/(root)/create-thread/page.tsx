import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';


async function Page() {
    const user = await currentUser();

    if (!user) {
        return null;
    } 

    const userInfo = await fetchUser(user.id);
    return (
        <div>
            <h1 className="head-text">Create Thread</h1>
        </div>
    );
}

export default Page;