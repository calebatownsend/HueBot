// Probabilities that HueBot will respond to some trigger
const responseProbability = {
    keyword: 16,    // % to reply if message.content includes a familiar keyword term
    channel: 1,     // % to reply if message.channel includes a familiar channel name; applies to -all- messages in a channel, so use a low %
    reaction: 1,    // % to react to a message
    edit: 8        // % to reply to an edited message
}

// Returns TRUE if a random percentage exceeds the provided input
function rollPercent(percent) {
    return percent >= Math.random() * 100;
}

// Executes the provided response function
function issueResponse(response) {
    response();
}

module.exports = (function() {
    this.responseProbability = responseProbability;
    this.rollPercent = rollPercent;
    this.issueResponse = issueResponse;
})();