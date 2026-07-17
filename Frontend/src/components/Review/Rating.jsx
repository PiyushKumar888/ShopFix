

export const Rating = ({
                           setRating,
                           currentRating = 0,
                           readOnly = false,
                           name = "rating"
                       }) => {
    return (
        <div className="rating rating-lg">
            <input
                type="radio"
                name={name}
                className="rating-hidden"
                checked={currentRating === 0}
                onChange={() => !readOnly && setRating?.(0)}
            />

            {[1, 2, 3, 4, 5].map((star) => (
                <input
                    key={star}
                    type="radio"
                    name={name}
                    className="mask mask-star-2 bg-amber-400"
                    aria-label={`${star} star`}
                    checked={Number(currentRating) === star}
                    onChange={() => !readOnly && setRating?.(star)}
                    disabled={readOnly}
                />
            ))}
        </div>
    );
};