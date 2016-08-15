$(document).ready(function() {
    var calc = new Calculator();
});

var Calculator = function () {
    var INITIAL_STATE = 0;
    var NUMBER_ENTRY_STATE = 1;
    var COMPLETE_ENTRY_STATE = 2;
    var OPERATOR_CHOSEN_STATE = 3;
    var CLEAR_STATE = 4;
    var RESULT_STATE = 5;
    var ERROR_STATE = 6;
    var DECIMAL_ENTERED_STATE = 7;
    var NUMBER_ENTRY_AFTER_DECIMAL_STATE = 8;
    
    var state = INITIAL_STATE;
    var prevVal = 0;
    var repeatVal = 0;
    var lastOperation = "+";
    var memoryValue = 0;
    var memoryActive = false;
    
    this.clearButtonPressed = function() {
        switch (state) {
            case ERROR_STATE:
                $(".equation").text("");
                $(".entry").text("0");
                prevVal = 0;
                repeatVal = 0;
                lastOperation = "+";
                state = INITIAL_STATE;
                break;
            
            case INITIAL_STATE:
                break;
            
            case NUMBER_ENTRY_STATE:
            case COMPLETE_ENTRY_STATE:
            case OPERATOR_CHOSEN_STATE:
            case DECIMAL_ENTERED_STATE:
            case NUMBER_ENTRY_AFTER_DECIMAL_STATE:
                $(".entry").text("0");
                $(".clear-button").text("CA");
                state = CLEAR_STATE;
                break;
            
            case CLEAR_STATE:
                $(".clear-button").text("C");
            case RESULT_STATE:
                prevVal = 0;
                repeatVal = 0;
                lastOperation = "+";
                $(".equation").text("");
                $(".entry").text("0");
                state = INITIAL_STATE;
                break;
        }

        $(this).blur();
    };
    
    this.evaluateButtonPressed = function() {
        switch (state) {
            case ERROR_STATE:
            case INITIAL_STATE:
                break;
            
            case CLEAR_STATE:
                $(".clear-button").text("C");
            case NUMBER_ENTRY_STATE:
            case COMPLETE_ENTRY_STATE:
            case OPERATOR_CHOSEN_STATE:
            case DECIMAL_ENTERED_STATE:
            case NUMBER_ENTRY_AFTER_DECIMAL_STATE:
                $(".equation").text("");
                repeatVal = $(".entry").text();
                var t = eval(prevVal + lastOperation + repeatVal);

                if (!isFinite(t)) {
                    $(".entry").text("Error");
                    state = ERROR_STATE;
                    break;
                }

                $(".entry").text(t);
                prevVal = 0;
                state = RESULT_STATE;
                break;
            
            case RESULT_STATE:
                var t = eval($(".entry").text() + lastOperation + repeatVal);
                
                if (!isFinite(t)) {
                    $(".entry").text("Error");
                    state = ERROR_STATE;
                    break;
                }
                
                $(".entry").text(t);
                break;
        }

        $(this).blur();
    };
    
    this.memoryButtonPressed = function() {
        switch (state) {
            case ERROR_STATE:
                break;
            
            default:
                switch ($(this).prop("id")) {
                    case "memory-clear":
                        memoryValue = 0;
                        memoryActive = false;
                        $(".memory").text("");
                        break;
                    
                    case "memory-add":
                        memoryValue += parseFloat($(".entry").text());
                        memoryActive = true;
                        $(".memory").text("M");
                        break;
                    
                    case "memory-subtract":
                        memoryValue -= parseFloat($(".entry").text());
                        memoryActive = true;
                        $(".memory").text("M");
                        break;
                    
                    case "memory-recall":
                        if (!memoryActive)
                            break;
                    
                        if (state == RESULT_STATE) {
                            lastOperation = "+";
                            prevVal = 0;
                        }
                    
                        $(".entry").text(memoryValue);
                        state = COMPLETE_ENTRY_STATE;
                        break;
                }
        }

        $(this).blur();
    };
    
    this.numberButtonPressed = function() {
        switch (state) {
            case ERROR_STATE:
                break;
            
            case RESULT_STATE:
                prevVal = 0;
                lastOperation = "+";
            case CLEAR_STATE:
                $(".clear-button").text("C");
            case INITIAL_STATE:
            case COMPLETE_ENTRY_STATE:
            case OPERATOR_CHOSEN_STATE:
                $(".entry").text($(this).text());
                state = NUMBER_ENTRY_STATE;
                break;
            
            case DECIMAL_ENTERED_STATE:
                state = NUMBER_ENTRY_AFTER_DECIMAL_STATE;
            case NUMBER_ENTRY_AFTER_DECIMAL_STATE:
            case NUMBER_ENTRY_STATE:
                var t = $(".entry").text();
                $(".entry").text(t + $(this).text());
                break;        
        }
        
        $(this).blur();
    };
    
    this.operatorButtonPressed = function() {
        switch (state) {
            case ERROR_STATE:
                break;
            
            case DECIMAL_ENTERED_STATE:
                $(".entry").text($(".entry").text() + "0");
            case RESULT_STATE:
                prevVal = 0;
                lastOperation = "+";
            case CLEAR_STATE:
                $(".clear-button").text("C");
            case INITIAL_STATE:
            case NUMBER_ENTRY_STATE:
            case NUMBER_ENTRY_AFTER_DECIMAL_STATE:
            case COMPLETE_ENTRY_STATE:
                var t = $(".equation").text();
                $(".equation").text($(this).text() + " " + $(".entry").text() + " " + t);
                t = eval(prevVal + lastOperation + $(".entry").text());
    
                if (!isFinite(t)) {
                    $(".entry").text("Error");
                    state = ERROR_STATE;
                    break;
                }
                
                prevVal = t;
                $(".entry").text(t);

                switch ($(this).prop("id")) {
                    case "multiply":
                        lastOperation = "*";
                        break;
                    
                    case "divide":
                        lastOperation = "/";
                        break;
                    
                    default:
                        lastOperation = $(this).text();
                        break;
                }
                
                state = OPERATOR_CHOSEN_STATE;
                break;
            
            case OPERATOR_CHOSEN_STATE:
                var t = $(".equation").text();
                $(".equation").text($(this).text() + t.substring(1));

                switch ($(this).prop("id")) {
                    case "multiply":
                        lastOperation = "*";
                        break;
                    
                    case "divide":
                        lastOperation = "/";
                        break;
                    
                    default:
                        lastOperation = $(this).text();
                        break;
                }
                
                break;
        }
        
        $(this).blur();
    };
    
    this.unaryOperatorButtonPressed = function() {
        if (state == ERROR_STATE) {
            $(this).blur();
            return;
        }
        
        if (state == RESULT_STATE) {
            prevVal = 0;
            lastOperation = "+";
        }
        
        var value = parseFloat($(".entry").text());

        switch ($(this).prop("id")) {
            case "square":
                value *= value;
                break;
            
            case "root":
                value = Math.pow(value, 0.5);
                break;
            
            case "percent":
                value *= prevVal / 100;
                break;
            
            case "negate":
                value *= -1;
                break;
        }
        
        $(".entry").text(value);
        state = COMPLETE_ENTRY_STATE;

        $(this).blur();
    };
    
    this.decimalButtonPressed = function() {
        switch (state) {
            case DECIMAL_ENTERED_STATE:
            case NUMBER_ENTRY_AFTER_DECIMAL_STATE:
            case ERROR_STATE:
                break;
            
            case RESULT_STATE:
                prevVal = 0;
                lastOperation = "+";
            case CLEAR_STATE:
                $(".clear-button").text("C");
            case INITIAL_STATE:
            case COMPLETE_ENTRY_STATE:
            case OPERATOR_CHOSEN_STATE:
                $(".entry").text("0.");
                state = DECIMAL_ENTERED_STATE;
                break;
            
            case NUMBER_ENTRY_STATE:
                var t = $(".entry").text();
                $(".entry").text(t + ".");
                state = DECIMAL_ENTERED_STATE;
                break;
        }
        
        $(this).blur();
    };
    
    $(".clear-button").on("click", this.clearButtonPressed);
    $(".evaluate-button").on("click", this.evaluateButtonPressed);
    $(".memory-button").on("click", this.memoryButtonPressed);
    $(".number-button").on("click", this.numberButtonPressed);
    $(".operator-button").on("click", this.operatorButtonPressed);
    $(".unary-operator-button").on("click", this.unaryOperatorButtonPressed);
    $(".decimal-button").on("click", this.decimalButtonPressed);
}