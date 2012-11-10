# Upcoming releases
- load configuration
-- handle pub port
-- handle sub port
-- handle a min set of data that is available in the cluster
- automatic key generation based on 100ms?
- store the data in time series format
- pluggable operators on the stream
- Representation as json
-- adaptors in xml, yaml
- support windows 
-- sliding: time, length, sorted, ranked, accumulating, time-ordering, externally-timed, expiry-expression-based with aggregations
-- tumbling: time, length and multi-policy; first-event; expiry-expression-based with aggregations
- Grouping, aggregation, sorting, filtering, merging, splitting or duplicating of event streams

- vocab
-- event
--- name, type, qos (can be discovered)
--- unique-id (user issued or system issued)

-- source
-- filter
---- user can write code and this could be an sql as well
-- sink


###

# Goals
- Handle streams of data

# references
- Google Dremel
- Apache Drill
- Storm
- S4

