/**
 * Created by Tristan on 17/09/2017.
 */

var IteeConfig = {
    error: (function UndefinedIteeClientConfiguration () {
        var errorMessage = "The IteeConfig is not defined, or the file not existing on the actual server. Please accept our appologies !"
        console.error(errorMessage)
        return errorMessage
    })()
}
