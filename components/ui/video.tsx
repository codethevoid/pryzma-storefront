const getVideoSrc = (src: string) => {
  try {
    const url = new URL(src);
    const id = url.searchParams.get("v");
    if (!id) return src.replace("youtube.com", "youtube-nocookie.com");

    // delete only the v param
    url.searchParams.delete("v");
    const searchParamsString = url.searchParams.toString();

    return `https://www.youtube-nocookie.com/embed/${id}${searchParamsString.length > 0 ? `?${searchParamsString}` : ""}`;
  } catch (e) {
    console.error(e);
    return src;
  }
};

export const Video = ({ src }: { src: string }) => {
  const embeddedSrc = getVideoSrc(src);
  console.log(embeddedSrc);

  return (
    <div className="relative h-0 pb-[56.25%]">
      <iframe
        className="absolute left-0 top-0 h-full w-full rounded-md shadow-borders-base"
        title={`Youtube video player`}
        src={embeddedSrc}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
