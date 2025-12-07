type BlogDetailsPageProps = {
  params: Promise<{
    blogId: string;
  }>;
};

export default async function BlogDetailsPage({
  params,
}: BlogDetailsPageProps) {
  const { blogId } = await params;
  return (
    <div>
      BlogDetailsPage
      <p>{blogId}</p>
    </div>
  );
}
