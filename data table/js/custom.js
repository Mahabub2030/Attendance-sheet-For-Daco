
$(document).ready(function() {
    // Get the current date
    var currentDate = new Date();
    // Get the month and convert it to a string with the full month name
    var currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });

    var table = $('#example').DataTable({
        buttons: [
            'copy', 
            'csv', 
            'excel', 
            {
                extend: 'pdf',
                customize: function (doc) {
                    // Change page size and orientation to A4
                    doc.pageOrientation = 'landscape';
                    doc.pageSize = 'A3';
                    doc.defaultStyle.fontSize = 10;
                    
                    // Apply text-center class to 9th and 10th columns in PDF
                    doc.content[1].table.body.forEach(function(row) {
                        row[8].alignment = 'center'; // 9th column alignment
                        row[9].alignment = 'center'; // 10th column alignment
                    });

                    // Increase font size for all cells
                    doc.content[1].table.body.forEach(function(row) {
                        row.forEach(function(cell) {
                            cell.fontSize = 8;
                        });
                    });
                }
            }, 
            'print', 
            'add', 
            'remove'
        ]
    });

    // Update the title to display the current month
    $('.title').text("Manpower List Month Of " + currentMonth + "-" + currentDate.getFullYear());

    // Apply text-center class to all columns except the first three and last one
    table.columns().every(function() {
        var colIdx = this.index();
        if (colIdx !== 0 && colIdx !== 1 && colIdx !== 2 && colIdx !== table.columns().count() - 1) {
            table.column(colIdx).nodes().to$().addClass('text-center');
        }
    });

    // Calculate total present and total holidays for each row
    table.rows().every(function() {
        var rowData = this.data();
        var totalPresent = 0;
        var totalHoliday = 0;
        for (var i = 4; i < rowData.length - 1; i++) { // Exclude first three columns and the last one
            if (rowData[i] === 'P') {
                totalPresent++;
            } else if (rowData[i] === 'H') {
                totalHoliday++;
            }
        }
        rowData[rowData.length - 1] = 'P: ' + totalPresent + ', H: ' + totalHoliday;
        this.data(rowData);
    });

    table.buttons().container().appendTo('#example_wrapper .col-md-6:eq(0)');


    // Set the current month in the page title and header
    $('#currentMonthHeader').text(currentMonth);
    document.title = "Attendance Sheet  Month of 2025 -  " + currentMonth ;
});

