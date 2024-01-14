module.exports = {
    // 1 .. 2 3 4 current 5 6 .. total -> max_display_pages = 6
    dynamic_scroll_pagination(max_display_pages, per_page, current_page, items) {
        const total_pages = ((items.length/per_page) >> 0) + (items.length % per_page == 0 ? 0 : 1);
        let start_idx = (current_page - (max_display_pages/2)>>0);
        let end_idx = (current_page + (max_display_pages/2)>>0);
        if (start_idx < 0 && end_idx < total_pages) end_idx += -start_idx;
        else if (end_idx > total_pages && start_idx > 0) start_idx -= (end_idx - total_pages);
        start_idx = Math.max(start_idx, 0);
        end_idx = Math.min(end_idx, total_pages);
        return {
            pages: Array.from({length: end_idx - start_idx}, (_, i) => i + start_idx + 1),
            items: items.slice((current_page-1)*per_page, current_page*per_page),
            total_pages
        }
    },
}
