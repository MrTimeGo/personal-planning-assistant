from Levenshtein import distance

def find_nearest(value: str, array: list[str]) -> (str, int):
    distances = list(map(lambda x: distance(x, value), array))
    min_distance = min(distances)
    return array[distances.index(min_distance)], min_distance