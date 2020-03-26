import csv

def time_parser(input, col):
	idxList = []
	for (idx, char) in enumerate(input):
		if (char == '/' or char == ' ' or char == ':'):
			idxList.append(idx)
	if len(idxList) != 4:
		print("Format error!")
		return None

	if col == 'Month':
		return input[0:idxList[0]]
	elif col == 'Day':
		return input[idxList[0]+1:idxList[1]]
	elif col == 'Year':
		return input[idxList[1]+1:idxList[2]]
	elif col == 'Hour':
		return input[idxList[2]+1:idxList[3]]
	elif col == 'Minute':
		return input[idxList[3]+1:]
	else:
		print("Input param error!")
		return None

def csv_process(src, dest):
	#keepCols = [0, 2, 21, 5, 6, 8]
	with open(src, 'r') as srcFile:
		reader = csv.reader(srcFile, delimiter=',', quotechar='"')
		with open(dest, 'w+') as output:
			writer = csv.writer(output, delimiter=',', quotechar='"')
			writer.writerow(['EventID'] + next(writer))
			for row in reader:
			    writer.writerow(row[0] + next(writer))

if __name__ == "__main__":
    with open('events.csv', 'r') as events, open('locations.csv', 'r') as times:
        event = csv.reader(events, delimiter=',', quotechar='"')
        time = csv.reader(times, delimiter=',', quotechar='"')
        with open('test.csv', 'w+') as output:
            writer = csv.writer(output, delimiter=',', quotechar='"')
            writer.writerow(['EventID'] + next(time))
            _ = next(event)
            for row in time:
                id = event.next()[0]
                content = [id]
                for i, x in enumerate(row):
                    content.append(x)
                writer.writerow(content)

	

