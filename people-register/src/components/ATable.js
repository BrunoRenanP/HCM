import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';

const TableTitle = styled(Typography)`
  font-family: 'Poppins', sans-serif;
`;

const EnhancedTableHead = (props) => {
  const { onSelectAllClick, numSelected, rowCount, headCells } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'selecionar todas as linhas' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sx={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, selectedRows, title, filterText, onFilterTextChange, onFilter, onDelete, onEdit } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
          fontFamily="Poppins, sans-serif"
        >
          {numSelected} selecionado(s)
        </Typography>
      ) : (
        <TableTitle
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </TableTitle>
      )}

      {numSelected > 0 ? (
        <>
          {numSelected === 1 && (
            <Tooltip title="Editar">
              <IconButton onClick={() => onEdit(selectedRows[0])}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Excluir">
            <IconButton onClick={() => onDelete(selectedRows)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <TextField
            label="Filtrar por nome"
            variant="standard"
            value={filterText}
            onChange={onFilterTextChange}
            sx={{ mr: 2, fontFamily: 'Poppins, sans-serif' }}
            InputProps={{ style: { fontFamily: 'Poppins, sans-serif' } }}
            InputLabelProps={{ style: { fontFamily: 'Poppins, sans-serif' } }}
          />
          <Tooltip title="Buscar">
            <IconButton onClick={onFilter}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedRows: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  filterText: PropTypes.string.isRequired,
  onFilterTextChange: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

const ATable = ({ columns, rows: initialRows, title, fetchFilteredRows, onDeleteRows, onEditRow }) => {
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      const newSelectedRows = rows.map((n) => n);
      setSelected(newSelected);
      setSelectedRows(newSelectedRows);
      return;
    }
    setSelected([]);
    setSelectedRows([]);
  };

  const handleClick = (event, id) => {
    const isSelected = selected.includes(id);
    const updatedSelected = isSelected
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    const updatedSelectedRows = isSelected
      ? selectedRows.filter((row) => row.id !== id)
      : [...selectedRows, rows.find((row) => row.id === id)];

    setSelected(updatedSelected);
    setSelectedRows(updatedSelectedRows);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleFilter = async () => {
    const filteredRows = await fetchFilteredRows(filterText);
    setRows(filteredRows);
    setPage(0);
  };

  const handleDelete = (rowsToDelete) => {
    onDeleteRows(rowsToDelete);
    setSelected([]);
    setSelectedRows([]);
  };

  const handleEdit = (rowToEdit) => {
    onEditRow(rowToEdit);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(() => {
    return rows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [page, rowsPerPage, rows]);

  return (
    <Box sx={{ width: '100%', padding: '24px', boxSizing: 'border-box' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedRows={selectedRows}
          title={title}
          filterText={filterText}
          onFilterTextChange={handleFilterTextChange}
          onFilter={handleFilter}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
          <Table
            sx={{ minWidth: 600, fontFamily: 'Poppins, sans-serif' }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
              headCells={columns}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.numeric ? 'right' : 'left'}
                        padding={column.disablePadding ? 'none' : 'normal'}
                        sx={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {column.format ? column.format(row) : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={columns.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ fontFamily: 'Poppins, sans-serif' }}
        />
      </Paper>
    </Box>
  );
};

ATable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  fetchFilteredRows: PropTypes.func.isRequired,
  onDeleteRows: PropTypes.func.isRequired,
  onEditRow: PropTypes.func.isRequired,
};

export default ATable;
