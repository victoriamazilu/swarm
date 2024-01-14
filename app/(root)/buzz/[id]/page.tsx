import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import Comment from "@/components/forms/Comment";
import BuzzCard from "@/components/cards/BuzzCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchBuzzById } from "@/lib/actions/buzz.actions";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const buzz = await fetchBuzzById(params.id);

  return (
    <section className='relative'>
      <div>
        <BuzzCard
          id={buzz._id}
          currentUserId={user.id}
          parentId={buzz.parentId}
          content={buzz.text}
          author={buzz.author}
          community={buzz.community}
          createdAt={buzz.createdAt}
          comments={buzz.children}
        />
      </div>

      <div className='mt-7'>
        <Comment
          buzzId={params.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className='mt-10'>
        {buzz.children.map((childItem: any) => (
          <BuzzCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
