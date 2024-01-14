function check_auto_fill(input_id, on_auto_fill) {
    window.setTimeout(() => {
        const input = document.getElementById(input_id);
        if (input.matches(':-internal-autofill-selected')) {
            on_auto_fill(input);
        }
    }, 50);
}
