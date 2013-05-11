

def load_file(name):
    f = open('application/templates/' + name)
    return reduce(lambda all, l: all + l, f.readlines())
